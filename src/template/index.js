import _ from '../util'
import dom from '../dom'
import {
  Text,
  DirectiveGroup
} from './binding'
import config from '../config'
import DomParser from './DomParser'
import TextParser from './TextParser'

const domParserCfg = 'domParser',
  textParserCfg = 'textParser'

config.register(domParserCfg, DomParser)
config.register(textParserCfg, TextParser)
