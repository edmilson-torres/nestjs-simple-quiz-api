export const stringCapitalize = (value: string) => {
    return (
        value.trim().charAt(0).toUpperCase() +
        value.trim().slice(1).toLowerCase()
    )
}
