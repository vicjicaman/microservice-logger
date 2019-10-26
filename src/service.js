import morgan from "morgan";
import requestId from "express-request-id";

morgan.token("id", req => req.id);

export const use = (app, { logger }) => {
  app.use(requestId({ setHeader: false }));

  const stream = {
    write: function(message, encoding) {
      logger.info(message);
    }
  };

  app.use(
    morgan("[:date[iso] #:id] Started :method :url for :remote-addr", {
      immediate: true,
      stream
    })
  );

  app.use(
    morgan(
      "[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms",
      { stream }
    )
  );

  return app;
};
