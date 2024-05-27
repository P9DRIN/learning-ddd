import { beforeEach, expect, it } from 'vitest'

import { describe } from 'node:test'
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send notifications', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova pergunta',
      content: 'conteudo da pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
   
  })
})
