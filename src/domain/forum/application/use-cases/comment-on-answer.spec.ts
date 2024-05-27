import { beforeEach, expect, it } from 'vitest'
import { describe } from 'node:test'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers.repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answers-attachments-repository'


let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
      inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository = new InMemoryAnswerRepository(inMemoryAnswerAttachmentsRepository)
      inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
        inMemoryAnswersRepository,
        inMemoryAnswerCommentsRepository
    )
  })

  it('should be able to comment on answer ', async () => {
    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'comentario teste'
    })
    
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('comentario teste')
  })


})
