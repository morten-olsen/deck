export const chunkArray = <T>(array: T[], size: number) => {
  let result:T[][] = []
  for (let value of array){
      let lastArray = result[result.length -1 ]
      if(!lastArray || lastArray.length == size){
          result.push([value])
      } else{
          lastArray.push(value)
      }
  }
  return result
}

