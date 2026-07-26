# Worker wiring guide

Do not copy release modules directly into the production router without review.
Create one implementation PR per bounded capability. Register a disabled route,
call existing middleware, invoke the service, record privacy-safe audit metadata
and provide structured errors. Promote only after tests and pilot evidence.
