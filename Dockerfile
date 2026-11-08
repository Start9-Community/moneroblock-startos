FROM --platform=$BUILDPLATFORM docker.io/library/golang:1.25-alpine@sha256:1ae0735f00daffa3aaf1363a5184c0d2dc55c78e3db4ec70241cdac97bf84b59 AS builder
ARG TARGETARCH
RUN apk add --no-cache patch
WORKDIR /src
COPY upstream/ ./
COPY patches/ /patches/
RUN patch -p1 < /patches/startos-rpc.patch \
    && go mod download \
    && go mod verify \
    && CGO_ENABLED=0 GOARCH=$TARGETARCH go build -mod=readonly -trimpath -ldflags="-s -w" -o /moneroblock .
FROM docker.io/library/alpine:3.24@sha256:3f4d6b32e26703c6082839234f43769d5046b3ac7c910033911d1e71d8cd630a
COPY --from=builder /moneroblock /usr/local/bin/moneroblock
