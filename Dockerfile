# create build folder
FROM node:12.14.0 AS builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ .
RUN yarn
RUN yarn run build

# use serve for build folder
FROM nginx:stable
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
