brewery
=======

proxy service for combining all our servers into one server and routing requests.


## usage

```
node brewery --config ../config.json
```

```
node brewery --config http://pohjanmaa/my-config
```

Services need to already be running locally, using the same config that you give to brewery.

The combined service will then be accessible at http://localhost:5000
