#!/bin/sh 
export  $(xargs < .env)
cargo lambda deploy --iam-role $IAM_ROLE
