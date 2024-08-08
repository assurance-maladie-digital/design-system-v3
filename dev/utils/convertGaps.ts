export const convertGaps = (gaps: any) => {
    const result: { [key: string]: string | number } = {}
    for (const key in gaps) {
        result[`ga-${key}`] = `${gaps[key]} !important`
    }
    console.log(result)
    return result
}