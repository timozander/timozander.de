---
title: "Materialized Views in Postgres: Our Experience and Insights"
description:
  "Efficient data processing is essential in today’s software landscape, and our
  Full Enterprise Operations Platform (FEOP) project exemplifies this need. Our
  application allows consulting firms to manage their business processes,
  including employee management, project planning and staffing procedures. It
  thus requires us to aggregate large datasets which poses significant
  performance challenges when done in real time. So, we looked for a solution
  that would significantly improve performance in the context of our tech stack:
  Next.js, Spring Boot, PostgreSQL, and Redis, which are all orchestrated on a
  Kubernetes cluster. While we were looking for a solution that involved Redis
  caching at first, we quickly started to shift our focus towards a more
  promising way of aggregating and maintaining data using materialized views."
published: 2024-09-04
category: Elsewhere
lang: en
source: "Senacor Blog"
externalUrl: "https://senacor.blog/materialized-views-in-postgres-our-experience-and-insights/"
tags:
  - elsewhere
---

> Originally published at
> [Senacor Blog](https://senacor.blog/materialized-views-in-postgres-our-experience-and-insights/).

Efficient data processing is essential in today’s software landscape, and our
Full Enterprise Operations Platform (FEOP) project exemplifies this need. Our
application allows consulting firms to manage their business processes,
including employee management, project planning and staffing procedures. It thus
requires us to aggregate large datasets which poses significant performance
challenges when done in real time. So, we looked for a solution that would
significantly improve performance in the context of our tech stack: Next.js,
Spring Boot, PostgreSQL, and Redis, which are all orchestrated on a Kubernetes
cluster. While we were looking for a solution that involved Redis caching at
first, we quickly started to shift our focus towards a more promising way of
aggregating and maintaining data using materialized views.

In the following chapters, we share our insights and experiences of why we
started to use materialized views, how we use them, the challenges we
encountered, and why it is our preferred method for aggregating data in the FEOP
project in more detail.

[Continue reading at Senacor Blog](https://senacor.blog/materialized-views-in-postgres-our-experience-and-insights/).
