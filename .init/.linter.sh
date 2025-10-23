#!/bin/bash
cd /tmp/kavia/workspace/code-generation/scientific-calculator-pro-671445-671462/calculator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

