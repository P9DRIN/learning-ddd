import { beforeEach, expect, it } from 'vitest'
import { describe } from 'node:test'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch paginate recent questions', async () => {

    // for (let i = 1; i <= 21; i++){
    //     await inMemoryAnswerRepository.create(makeQuestion())
    // }

    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}))
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

    expect(result.value?.questionComments).toHaveLength(3)

    

  }


)   
it('should be able to fetch paginate recent questions', async () => {
    for (let i = 1; i <= 21; i++){
        await  inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-2')}))
    }
    const result = await sut.execute({
        questionId: 'question-2',
        page: 2,
    })
    expect(result.value?.questionComments).toHaveLength(1)
})
})
