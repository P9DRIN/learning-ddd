import { beforeEach, expect, it } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers.repository'
import { describe } from 'node:test'
import { FetchQuestionsAnswerUseCase } from './fetch-questions-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answers-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: FetchQuestionsAnswerUseCase

describe('Fetch question answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionsAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to fetch paginate recent questions', async () => {

    // for (let i = 1; i <= 21; i++){
    //     await inMemoryAnswerRepository.create(makeQuestion())
    // }

    await inMemoryAnswerRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}))
    await inMemoryAnswerRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}))
    await inMemoryAnswerRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}))
    // await inMemoryAnswerRepository.create(makeQuestion({
    //     createdAt: new Date('2022, 0, 18')
    // }))
    // await inMemoryAnswerRepository.create(makeQuestion({
    //     createdAt: new Date('2022, 0, 23')
    // }))


    const result = await sut.execute({
        questionId: 'question-1',
        page: 1,
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

    expect(result.value?.answers).toHaveLength(3)

    

  }


)   
it('should be able to fetch paginate recent questions', async () => {
    for (let i = 1; i <= 21; i++){
        await inMemoryAnswerRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-2')}))
    }
    const result = await sut.execute({
        questionId: 'question-2',
        page: 2,
    })
    expect(result.value?.answers).toHaveLength(1)
})
})
