import { MockInstance, SpyInstance, beforeEach, describe, expect, it, vi } from "vitest";
import { OnAnswerCreated } from "./on-answer-created";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers.repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import { waitFor } from "test/utils/wait-for";

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotificationExecuteSpy: MockInstance<[SendNotificationUseCaseRequest], Promise<SendNotificationUseCaseResponse>>

describe('On Answer Created', () => {

    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
        inMemoryAnswersRepository = new InMemoryAnswerRepository(inMemoryAnswerAttachmentRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)

    })

    it('should send a notification when an answer is created', async () => {

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswersRepository.create(answer)


        await waitFor(() => {
        expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})