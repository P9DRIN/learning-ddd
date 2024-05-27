import { beforeEach, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { describe } from 'node:test'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'


let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch paginate recent questions', async () => {

    for (let i = 1; i <= 21; i++){
        await inMemoryQuestionsRepository.create(makeQuestion())
    }

    await inMemoryQuestionsRepository.create(makeQuestion({
        createdAt: new Date('2022, 0, 20')
    }))
    // await inMemoryQuestionsRepository.create(makeQuestion({
    //     createdAt: new Date('2022, 0, 18')
    // }))
    // await inMemoryQuestionsRepository.create(makeQuestion({
    //     createdAt: new Date('2022, 0, 23')
    // }))


    const result = await sut.execute({
        page: 2,
    })

    // expect(question).toEqual([
    //     expect.objectContaining({
    //         createdAt: new Date('2022, 0, 23')
    //     }),
    //     expect.objectContaining({
    //         createdAt: new Date('2022, 0, 20')
    //     }),
    //     expect.objectContaining({
    //         createdAt: new Date('2022, 0, 18')
    //     })
    // ])

    expect(result.value?.question).toHaveLength(2)

  })
})
