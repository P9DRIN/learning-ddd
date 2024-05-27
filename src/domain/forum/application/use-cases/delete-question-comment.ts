import { Either, left, right } from '@/core/types/either'
import { QuestionsCommentsRepository } from '../repositories/question-comments.repository'
import { ResourceNotFound } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}
type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFound | NotAllowedError, {}>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionsCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {


    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFound())
    }

    if(questionComment.authorId.toString() !== authorId) {
        return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
 
  }
}
