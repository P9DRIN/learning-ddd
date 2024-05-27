import { beforeEach, expect, it } from 'vitest'
import { describe } from 'node:test'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch paginate recent answers', async () => {

    // for (let i = 1; i <= 21; i++){
    //     await inMemoryAnswerRepository.create(makeAnswer())
    // }

    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}))
    // await inMemoryAnswerRepository.create(makeAnswer({
    //     createdAt: new Date('2022, 0, 18')
    // }))
    // await inMemoryAnswerRepository.create(makeAnswer({
    //     createdAt: new Date('2022, 0, 23')
    // }))


    const result = await sut.execute({
        answerId: 'answer-1',
        page: 1,
    })

    // expect(answer).toEqual([
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

    expect(result.value?.answerComments).toHaveLength(3)

    

  }


)   
it('should be able to fetch paginate recent answers', async () => {
    for (let i = 1; i <= 21; i++){
        await  inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-2')}))
    }
    const result = await sut.execute({
        answerId: 'answer-2',
        page: 2,
    })
    expect(result.value?.answerComments).toHaveLength(1)
})
})
