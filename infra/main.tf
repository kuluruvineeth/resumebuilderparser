terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.31.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  target_port = 3000

  ecs_launch_type = "FARGATE"
  ecs_desired_count = 2
  ecs_network_mode = "awsvpc"
  ecs_cpu = 512
  ecs_memory = 1024
  ecs_container_name = "resumebuilderparser-image"
  ecs_log_group = "/aws/ecs/${var.project_id}-${var.env}"
  ecs_log_retention = 1
}

data "template_file" "task_def_generated"{
  template = "${file("./task-definitions/service.json.tpl")}"
  vars = {
    env = var.env
    port = local.target_port
    name = local.ecs_container_name
    cpu = local.ecs_cpu
    memory = local.ecs_memory
    aws_region = var.aws_region
    ecs_execution_role = module.ecs_roles.ecs_execution_role_arn
    launch_type = local.ecs_launch_type
    network_mode = local.ecs_network_mode
    log_group = local.ecs_log_group
  }
}

resource "local_file" "output_task_def" {
  content = data.template_file.task_def_generated.rendered
  file_permission = "644"
  filename = "./task-definitions/service.latest.json"
}

resource "aws_ecs_task_definition" "resumebuilderparser" {
  family = "task-definition-node"
  execution_role_arn = module.ecs_roles.ecs_execution_role_arn

  requires_compatibilities = [local.ecs_launch_type]
  network_mode = local.ecs_network_mode
  cpu = local.ecs_cpu
  memory = local.ecs_memory
  container_definitions = jsonencode(
    jsondecode(
      data.template_file.task_def_generated.rendered
    ).containerDefinitions
  )
}

#### Networking (subnets, igw, nat gw, rt etc)
module "networking" {
    source = "github.com/Jareechang/tf-modules//networking?ref=v1.0.1"
    env = var.env
    project_id = var.project_id
    subnet_public_cidrblock = [
        "10.0.1.0/24",
        "10.0.2.0/24"
    ]
    subnet_private_cidrblock = [
        "10.0.11.0/24",
        "10.0.22.0/24"
    ]
    azs = ["us-east-1a", "us-east-1b"]
}

resource "aws_security_group" "alb_ecs_sg" {
  vpc_id = module.networking.vpc_id

  ingress {
    protocol = "tcp"
    from_port = 80
    to_port = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol = "tcp"
    from_port = local.target_port
    to_port = local.target_port
    cidr_blocks = module.networking.private_subnets[*].cidr_block
  }
}

resource "aws_security_group" "ecs_sg" {
  vpc_id = module.networking.vpc_id

  ingress {
    protocol = "tcp"
    from_port = local.target_port
    to_port = local.target_port
    security_groups = [aws_security_group.alb_ecs_sg.id]
  }

  egress {
    protocol = -1
    from_port = 0
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

module "ecs_tg" {
  source              = "github.com/Jareechang/tf-modules//alb?ref=v1.0.2"
  create_target_group = true
  port                = local.target_port
  protocol            = "HTTP"
  ## This is important! *
  target_type         = "ip"
  vpc_id              = module.networking.vpc_id
}

module "alb" {
  source             = "github.com/Jareechang/tf-modules//alb?ref=v1.0.2"
  create_alb         = true
  enable_https       = false
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_ecs_sg.id]
  subnets            = module.networking.public_subnets[*].id
  target_group       = module.ecs_tg.tg.arn
}

data "aws_caller_identity" "current" {}

resource "aws_ecr_repository" "main" {
  name = "web/${var.project_id}/resumebuilderparser"
  image_tag_mutability = "MUTABLE"
}

module "ecr_ecs_ci_user" {
  source = "github.com/Jareechang/tf-modules//iam/ecr?ref=v1.0.12"
  env = var.env
  project_id = var.project_id
  create_ci_user = true
  ecr_resource_arns = [
     "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/web/${var.project_id}",
    "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/web/${var.project_id}/*"
  ]
  other_iam_statements = {}
}

resource "aws_ecs_cluster" "web_cluster" {
  name = "web-cluster-${var.project_id}-${var.env}"
  setting {
    name = "containerInsights"
    value = "enabled"
  }
  
}

resource "aws_ecs_service" "web_ecs_service" {
  name            = "web-service-${var.project_id}-${var.env}"
  cluster         = aws_ecs_cluster.web_cluster.id
  task_definition = aws_ecs_task_definition.resumebuilderparser.arn
  desired_count   = local.ecs_desired_count
  launch_type = local.ecs_launch_type 

  load_balancer {
    target_group_arn = module.ecs_tg.tg.arn
    container_name   = local.ecs_container_name
    container_port   = local.target_port 
  }

  network_configuration {
    subnets         = module.networking.private_subnets[*].id
    security_groups = [aws_security_group.ecs_sg.id]
  }

  tags = {
    Name = "web-service-${var.project_id}-${var.env}"
  }

  depends_on = [
    module.alb.lb,
    module.ecs_tg.tg
  ]
}

resource "aws_cloudwatch_log_group" "ecs" {
  name = local.ecs_log_group
  # This can be changed
  retention_in_days = local.ecs_log_retention
}

module "ecs_roles" {
  source                    = "github.com/Jareechang/tf-modules//iam/ecs?ref=v1.0.1"
  create_ecs_execution_role = true
  create_ecs_task_role      = true

  ecs_execution_policies_extension = {}
}
