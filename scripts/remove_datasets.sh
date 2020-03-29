#!/bin/bash

DATASETS=$(bq ls | grep test_dataset)
echo $DATASETS
for dataset in $DATASETS; do
  echo "Deleting $dataset"
  bq rm -r -f $dataset
done
