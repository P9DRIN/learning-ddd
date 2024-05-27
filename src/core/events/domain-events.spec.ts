import { describe, expect, it, vi } from "vitest";
import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAgreggateCreated implements DomainEvent {
    public ocurredAt: Date;
    public aggregate: CustomAgreggate // eslint-disable-line

    constructor(aggregate: CustomAgreggate){
        this.ocurredAt = new Date()
        this.aggregate = aggregate
    }

    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }
}

class CustomAgreggate extends AggregateRoot<null>{
    static create(){
        const aggregate = new CustomAgreggate(null)
        
        aggregate.addDomainEvent(new CustomAgreggateCreated(aggregate))

        return aggregate
    }
}

describe('domain events', () => {
    it('should be able to dispatch and listen to events', () => {

        const callbackSpy = vi.fn()

        DomainEvents.register(callbackSpy, CustomAgreggateCreated.name)

        const aggregate = CustomAgreggate.create()

        expect(aggregate.domainEvents).toHaveLength(1)

        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})