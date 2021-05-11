import { Svg } from "@svgdotjs/svg.js"
import opentype from "opentype.js"
import { AssetsStore, FontRenderers } from "../stores/AssetsStore"
import googleFontList from "./../assets/fonts/fonts.json"

export type Elements = {
    logoSVG: Svg
    titleSVG: Text & Svg
    sloganSVG: Text & Svg
}

export function buildFontSourceFileURL(font: string): string | null {
    if (window.logomaker.pluginURL) {
        const fileName = font.split(" ").join("") + "-Regular.ttf"
        return window.logomaker.pluginURL + "fonts/" + fileName
    }

    return null
}

export function getFontsFromServer(): void {
    const fontPaths = googleFontList.map((fontName) => {
        return {
            font: fontName,
            path: buildFontSourceFileURL(fontName),
        }
    })

    // Also add the font to the page
    fontPaths.forEach(async (font) => {
        const externalFont = new FontFace(font.font, `url(${font.path || ""})`)
        await externalFont.load()
        document.fonts.add(externalFont)
    })

    const fontRequets = fontPaths
        .filter((fontPath) => fontPath.path)
        .map(async (font) => {
            const renderer = await opentype.load(font.path || "")
            return {
                font: font.font,
                renderer: renderer,
            }
        })

    Promise.all(fontRequets).then((fontRenderers) => {
        // console.log(fontRenderers)
        // transformTextToSVG(fontRenderers[0].renderer, 'Hey', 52)
        AssetsStore.update((s) => {
            s.fonts.fontRenderers = fontRenderers.reduce((fontRenderers: FontRenderers, font): FontRenderers => {
                fontRenderers[font.font] = font.renderer
                return fontRenderers
            }, {})
            s.fonts.activeFonts = fontRenderers.map(({ font }) => font)
        })
    })
}

// export const addEmbeddedFont = (draw: Svg, font: string): void => {
//     draw.font(font,`url("${generateUrlForFonts([font])}")`)
// }

// LEGACY

// import { Svg, Text } from "@svgdotjs/svg.js"
// import { ContainerData } from "./render/alignFunctions"

// export type Elements = {
//     logoSVG: Svg
//     titleSVG: Text
//     sloganSVG: Text
// }

// export const moveToCenter = (
//     draw: Svg,
//     viewbox: {
//         width: number
//         height: number
//     },
//     container: ContainerData
// ): Elements => {
//     // Compute the center
//     const { logoSVG, titleSVG, sloganSVG } = container.containerElems

//     // check if the svg has scaled
//     const currentViewBox = draw.viewbox()

//     const viewboxWidth = currentViewBox.width // Math.max(viewbox.width, currentViewBox.width)
//     const viewboxHeight = currentViewBox.height // Math.max(viewbox.height, currentViewBox.height)

//     const xOffsetToCenter = viewboxWidth / 2 - container.containerPos.cx
//     const yOffsetToCenter = viewboxHeight / 2 - container.containerPos.cy

//     // Apply the relocation
//     logoSVG.center(logoSVG.cx() + xOffsetToCenter, logoSVG.cy() + yOffsetToCenter)
//     titleSVG.center(titleSVG.cx() + xOffsetToCenter, titleSVG.cy() + yOffsetToCenter)
//     sloganSVG.center(sloganSVG.cx() + xOffsetToCenter, sloganSVG.cy() + yOffsetToCenter)

//     return container.containerElems
// }
