import { beforeEach, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { describe } from 'node:test'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('edit question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentsRepository
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentRepository)
  })

  it('should be able to edit a question ', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    }, new UniqueEntityID('question-1'))

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      })
    )
    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'new title',
      content: 'new content',
      attachmentsIds: ['1', '3']
    })
    

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title',
      content: 'new content'
    })
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
      
    ])
  })
  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    }, new UniqueEntityID('question-1'))

    inMemoryQuestionsRepository.create(newQuestion)

    

      const result = await sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: 'author-2',
        title: 'new title',
        content: 'new content',
        attachmentsIds: []
      })


    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})
