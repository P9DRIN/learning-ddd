import { Either, left, right } from '@/core/types/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions.repository'
import { ResourceNotFound } from '../../../../core/errors/errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}
type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFound, {
  question: Question
}>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findbySlug(slug)

    if (!question) {
      return left(new ResourceNotFound())
    }

    return right({
      question,
    })
  }
}
