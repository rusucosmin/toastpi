#!/bin/bash

for pid in $(sudo lsof -i :8081 | awk {'print $2'} | tail -n +2)
do
    echo $pid
    kill -9 $pid
done
