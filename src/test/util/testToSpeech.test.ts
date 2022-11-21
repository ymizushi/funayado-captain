import { describe, expect, it} from "@jest/globals"
import { getNowDateWithString } from "@/util/textToSpeech"

describe("getNowDateWithString", () => {
  it("dateのstring表現が取得できること", () => {
    expect(getNowDateWithString(new Date(2022,11,22))).toStrictEqual("2022/12/22 00:00:00")
  })
})
