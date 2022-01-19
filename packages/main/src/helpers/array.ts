export const chunkArray = <T>(array: T[], size: number) => {
  const result:T[][] = []
  for (const value of array){
      const lastArray = result[result.length -1 ]
      if(!lastArray || lastArray.length == size){
          result.push([value])
      } else{
          lastArray.push(value)
      }
  }
  return result
}

