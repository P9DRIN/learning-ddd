import { PaginationParams } from '@/core/repositories/paginations-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionsCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(questionid: string, params: PaginationParams): Promise<QuestionComment[]>
  delete(questionComment: QuestionComment): Promise<void>
  create(questionComment: QuestionComment): Promise<void>
}
