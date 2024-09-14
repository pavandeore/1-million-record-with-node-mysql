#!/bin/bash

# URL of the API endpoint
API_URL="http://localhost:9000/update-records"

# Number of requests to send
NUM_REQUESTS=1000

# Loop to send the requests
for i in $(seq 1 $NUM_REQUESTS); do
  # Create a JSON payload with a unique ID and name
  PAYLOAD="{\"id\": $i, \"name\": \"new $i\"}"

  # Send the PUT request using curl
  curl -X PUT $API_URL \
       -H "Content-Type: application/json" \
       -d "$PAYLOAD" &

  # Optional: Sleep to prevent overwhelming the server
  # sleep 0.01
done

# Wait for all background processes to complete
wait

echo "Finished sending $NUM_REQUESTS requests."
