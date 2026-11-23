FROM node:24-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY --chown=node:node scripts/serve.mjs scripts/serve.mjs
COPY --chown=node:node www www
USER node
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:8080/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "scripts/serve.mjs"]
