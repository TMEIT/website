
# Run this script to regenerate postfix.yaml
# REMEMBER TO DELETE THE NAMESPACE LINE IN THE STATEFULSET!

# SMTP_HEADER_CHECKS strips away received headers noise from internal routing
# https://github.com/bokysan/docker-postfix/blob/master/configs/smtp_header_checks

helm repo add bokysan https://bokysan.github.io/docker-postfix/
helm template \
  --set persistence.enabled=false \
  --set config.general.ALLOWED_SENDER_DOMAINS="tmeit.se" \
  --set config.general.LOG_FORMAT=json \
  --set config.general.SMTP_HEADER_CHECKS="regexp:/etc/postfix/smtp_header_checks" \
  --set config.postfix.myhostname="tmeit.se" \
  --set resources.requests.cpu="50m" \
  --set resources.requests.memory="200Mi" \
  --set resources.limits.cpu="200m" \
  --set resources.limits.memory="400Mi" \
  postfix bokysan/mail > deploy/kubernetes/base/postfix/postfix.yaml
