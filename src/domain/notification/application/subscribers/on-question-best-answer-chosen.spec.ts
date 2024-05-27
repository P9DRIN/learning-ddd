import { MockInstance, beforeEach, describe, expect, it, vi } from "vitest";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers.repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import { waitFor } from "test/utils/wait-for";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotificationExecuteSpy: MockInstance<[SendNotificationUseCaseRequest], Promise<SendNotificationUseCaseResponse>>

describe('On Question Best Answer Chosen', () => {

    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
        inMemoryAnswersRepository = new InMemoryAnswerRepository(inMemoryAnswerAttachmentRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase)

    })

    it('should send a notification when topic has new best answer chosen', async () => {

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswersRepository.create(answer)

        question.bestAnswerId = answer.id
        inMemoryQuestionsRepository.save(question)

        await waitFor(() => {
        expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})