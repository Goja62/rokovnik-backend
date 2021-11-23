export class Funkcije {
    public istekToena(milisekunde: number) {
        return new Date().getTime() / 1000 + milisekunde
    }
}