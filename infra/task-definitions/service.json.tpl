{
  "family": "task-definition-node",
  "networkMode": "${network_mode}",
  "requiresCompatibilities": [
    "${launch_type}"
  ],
  "cpu": "${cpu}",
  "memory": "${memory}",
  "executionRoleArn": "${ecs_execution_role}",
  "containerDefinitions": [
    {
      "name": "${name}",
      "image": "nginx:latest",
      "memoryReservation": ${memory},
      "portMappings": [
        {
          "containerPort": ${port},
          "hostPort": ${port}
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "${port}"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${log_group}",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "secrets": []
    }
  ]
}