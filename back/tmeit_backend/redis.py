from arq.connections import RedisSettings


# Redis connection setting for arq
redis_settings = RedisSettings(host=[('rfs-redis', 26379)], sentinel=True, sentinel_master="mymaster")
