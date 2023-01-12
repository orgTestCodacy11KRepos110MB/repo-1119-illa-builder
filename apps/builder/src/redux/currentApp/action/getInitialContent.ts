import {
  ActionContent,
  ActionType,
} from "@/redux/currentApp/action/actionState"
import { ElasticSearchActionInitial } from "@/redux/currentApp/action/elasticSearchAction"
import { FirebaseActionInitial } from "@/redux/currentApp/action/firebaseAction"
import { GraphQLActionInitial } from "@/redux/currentApp/action/graphqlAction"
import { HuggingFaceActionInitial } from "@/redux/currentApp/action/huggingFaceAction"
import { MongoDbActionInitial } from "@/redux/currentApp/action/mongoDbAction"
import { MysqlLikeActionInitial } from "@/redux/currentApp/action/mysqlLikeAction"
import { RedisActionInitial } from "@/redux/currentApp/action/redisAction"
import { RestApiActionInitial } from "@/redux/currentApp/action/restapiAction"
import { S3ActionInitial } from "@/redux/currentApp/action/s3Action"
import { SMTPActionInitial } from "@/redux/currentApp/action/smtpAction"
import { TransformerActionInitial } from "@/redux/currentApp/action/transformerAction"

export function getInitialContent(actionType: ActionType): ActionContent {
  switch (actionType) {
    case "clickhouse":
    case "supabasedb":
    case "mariadb":
    case "tidb":
    case "mysql":
    case "postgresql":
      return MysqlLikeActionInitial
    case "restapi":
      return RestApiActionInitial
    case "transformer":
      return TransformerActionInitial
    case "redis":
      return RedisActionInitial
    case "mongodb":
      return MongoDbActionInitial
    case "elasticsearch":
      return ElasticSearchActionInitial
    case "s3":
      return S3ActionInitial
    case "smtp":
      return SMTPActionInitial
    case "firebase":
      return FirebaseActionInitial
    case "graphql":
      return GraphQLActionInitial
    case "huggingface":
      return HuggingFaceActionInitial
    default:
      return {} as ActionContent
  }
}
