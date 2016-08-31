// This file overrides the built-in PHP (cli) runner
// For more information see http://docs.c9.io:8080/#!/api/run-method-run
{
  "cmd": [
    "php",
    "$file",
    "$args"
  ],
  "selector": "^.*\\.(php|phar)$",
  "info": "Running PHP script $file",
  "cwd": "$project_path"
}