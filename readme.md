## MIMAGE ♟

### Resume

What was intended in this example was to upload an image to the api so that it can send the image buffer to the microservice in order to compress and resize the image. Finally, the link in the json response is given, so that we can see the image already compressed and resized.

### Brief Explanation

For this purpose, the [multer](https://github.com/expressjs/multer) dependency was used, which we used the memoryStorage so that later we could send only and exclusively the image buffer to the RabbitMQ queue.

As soon as the image buffer was consumed by the microservice, it would first check if the uploads folder exists in the project, if it does not exist it will create it. After that, image processing begins (the dependency that was used is called [sharp](https://github.com/lovell/sharp)).

At the end, a link from the microservice is sent to the api, so that it can serve as a static file (processed image).
