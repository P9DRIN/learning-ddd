import { Either, left, right } from '@/core/types/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'
import { ResourceNotFound } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}
type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFound | NotAllowedError, {}>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {


    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFound())
    }

    if(answerComment.authorId.toString() !== authorId) {
        return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
 
  }
}
