# Event-Driven Architecture

This diagram shows how the Products service fits into a distributed microservices architecture alongside Orders and Payments.

```mermaid
flowchart LR
    subgraph Clients
        WebUI[React Web UI]
        Mobile[Mobile App]
    end

    subgraph Gateway
        APIGW[API Gateway]
    end

    subgraph Services
        Products[Products Service]
        Orders[Orders Service]
        Payments[Payments Service]
        Inventory[Inventory Service]
    end

    subgraph Messaging
        EventBus[(Event Bus / Message Broker)]
    end

    subgraph Data
        ProductsDB[(Products DB)]
        OrdersDB[(Orders DB)]
        PaymentsDB[(Payments DB)]
    end

    WebUI --> APIGW
    Mobile --> APIGW
    APIGW --> Products
    APIGW --> Orders
    APIGW --> Payments

    Products --> ProductsDB
    Orders --> OrdersDB
    Payments --> PaymentsDB

    Products -->|ProductCreated| EventBus
    Products -->|ProductUpdated| EventBus
    Orders -->|OrderPlaced| EventBus
    Orders -->|OrderCancelled| EventBus
    Payments -->|PaymentCompleted| EventBus
    Payments -->|PaymentFailed| EventBus

    EventBus -->|ProductCreated| Inventory
    EventBus -->|OrderPlaced| Products
    EventBus -->|OrderPlaced| Payments
    EventBus -->|PaymentCompleted| Orders
    EventBus -->|PaymentFailed| Orders
```

## Flow examples

1. **Product created** — Products service persists the product and publishes `ProductCreated`. Inventory service consumes the event to update stock projections.
2. **Order placed** — Orders service publishes `OrderPlaced`. Products service validates availability; Payments service starts payment processing.
3. **Payment completed** — Payments service publishes `PaymentCompleted`. Orders service marks the order as paid and triggers fulfilment.

## Why event-driven?

- **Loose coupling** — Services evolve independently behind well-defined events.
- **Scalability** — Read-heavy product catalog traffic is isolated from order/payment workloads.
- **Resilience** — Temporary downstream failures can be retried asynchronously via the broker.

## Products service responsibilities

- Own product master data (name, colour, price)
- Expose secured CRUD/query APIs
- Publish product lifecycle events for downstream consumers
- Remain the system of record for product information
