import { CogIcon, HomeIcon, SplitHorizontalIcon, ComponentIcon } from "@sanity/icons"
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
        ),
      S.listItem()
        .title("Hero Section")
        .id("heroSection")
        .icon(SplitHorizontalIcon)
        .child(
          S.document()
            .schemaType("heroSection")
            .documentId("heroSection")
        ),
      S.listItem()
        .title("Footer Settings")
        .id("footer")
        .icon(ComponentIcon)
        .child(
          S.document()
            .schemaType("footer")
            .documentId("footer")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "homePage", "heroSection", "footer"].includes(item.getId() as string)
      ),
    ])
