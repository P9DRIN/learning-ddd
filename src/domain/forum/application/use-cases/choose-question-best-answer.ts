import { AnswersRepository } from '../repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions.repository'
import { Either, left, right } from '@/core/types/either'
import { ResourceNotFound } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFound | NotAllowedError, { question: Question} >

export class ChooseQuestionBestAnswerUseCase {
    
  constructor(private answersRepository: AnswersRepository, private questionsRepository: QuestionsRepository ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
   const answer = await this.answersRepository.findById(answerId)

    if(!answer){
       return left(new ResourceNotFound())
    }
    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if(!question){
       return left(new ResourceNotFound())
    }

    if(authorId !== question.authorId.toString()){
        return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({ question })
    

  }
}
