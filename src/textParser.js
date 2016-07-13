class TextParser{
  constructor(text){
    this.text = text
  }
  token(){
    throw new Error('abstract method')
  }
}

class NormalTextParser extends TextParser{
  constructor(text){
    super(text)
    this.index = 0
    this.reg = /{([^{]+)}/g
  }
  token(){
    let tk, reg = this.reg

    if(tk = reg.exec(this.text)){
      let index = reg.lastIndex

      this.index = index
      return {
        token: tk[1],
        start: index - tk[0].length,
        end: index
      }
    }
    this.index = 0
  }
}
TextParser.NormalTextParser = NormalTextParser
module.exports = TextParser
