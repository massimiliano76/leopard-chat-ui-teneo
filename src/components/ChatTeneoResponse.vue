<template>
  <!-- Reply -->
  <div v-if="item.type === 'reply'" :class="isLastItem ? 'pb-3' : ''">
    <span v-for="(extension, index) in itemExtensions(item)" :key="index + 'alerts' + uuid">
      <v-row v-if="beforeAnswerAlert(extension)" no-gutters class="pt-2">
        <v-col cols="12">
          <Alert :config="beforeAnswerAlert(extension)"></Alert>
        </v-col>
      </v-row>
    </span>
    <v-row v-if="itemText !== '<span>'" justify="start" no-gutters class="pr-3 pl-1 pt-2">
      <v-col
        v-if="showChatIcons && !$vuetify.breakpoint.smAndDown"
        cols="2"
        class="text-center d-none d-sm-block"
      >
        <v-menu v-if="isLiveAgentAssist" close-on-click close-on-content-click offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              v-long-press="1000"
              aria-hidden="true"
              :color="!$vuetify.theme.dark ? responseLookAndFeel.iconColor : ''"
              class="teneo-response-icon"
              text
              tile
              icon
              large
              v-on="on"
              @long-press-start="swapInputButton"
            >
              <v-icon large>{{ getResponseIcon }}</v-icon>
            </v-btn>
          </template>

          <v-list class="liveAgentAssistMenu">
            <v-hover
              v-for="menuItem in dynamicAgentAssistMenu"
              v-slot:default="{ hover }"
              :key="menuItem.title"
            >
              <v-list-item :class="hover ? 'primary' : ''" @click="menuItem.method">
                <v-list-item-title :class="hover ? 'white--text' : ''">
                  <v-icon :color="hover ? 'secondary' : ''" class="mr-2">
                    {{ menuItem.icon }}
                  </v-icon>
                  {{ menuItem.title }}
                </v-list-item-title>
              </v-list-item>
            </v-hover>
          </v-list>
        </v-menu>
        <v-icon
          v-else
          large
          :color="!$vuetify.theme.dark ? getResponseIconColor : 'indigo'"
          class="teneo-response-icon"
          >{{ getResponseIcon }}</v-icon
        >
      </v-col>
      <v-col
        class="text-left"
        :class="!showChatIcons || $vuetify.breakpoint.smAndDown ? 'ml-2' : ''"
      >
        <v-card
          :color="$vuetify.theme.dark ? '#333333' : `${responseLookAndFeel.blockBgColor}`"
          class="chat-card chat-card-left text-left"
          :class="hasBorder(0) ? 'leopard-response-border' : ''"
          :ripple="false"
        >
          <div
            v-if="hasBorder(0)"
            class="leopard-alert-border leopard-alert-border-left"
            :style="`color: ${getBorderColor()};`"
          ></div>
          <span
            class="teneo-reply"
            :class="`${leopardFont} ${
              responseLookAndFeel.blockTextColor === 'light' ? 'white--text' : ''
            }`"
          >
            <span v-html="addAccessibilityPrefix(itemText)"></span>
          </span>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Response Chunks -->
    <div v-if="responseHasChunks">
      <v-row
        v-for="(chunkText, responseChunkIndex) in getChunks"
        :key="responseChunkIndex + uuid"
        no-gutters
        class="pr-3 pl-1 pt-1"
      >
        <v-col v-if="showChatIcons" cols="2" class="text-center">
          <!-- <v-btn
            v-long-press="1000"
            tabindex="-1"
            @long-press-start="swapInputButton"
            style="opacity: 0"
            :color="`${responseLookAndFeel.iconColor} white--text`"
            class="teneo-response-icon"
            text
            tile
            icon
            large
          >
            <v-icon large class="white--text">{{ getResponseIcon }}</v-icon>
          </v-btn>-->
        </v-col>
        <v-col>
          <v-card
            class="chat-card chat-card-left text-left"
            :ripple="false"
            :class="responseChunkStyles(responseChunkIndex + 1)"
            :color="$vuetify.theme.dark ? '#333333' : '#FFFFFF'"
          >
            <div
              v-if="hasBorder(responseChunkIndex + 1)"
              class="leopard-alert-border leopard-alert-border-left"
              :style="`color: ${getBorderColor(responseChunkIndex + 1)};`"
            ></div>
            <span
              class="teneo-reply"
              :class="`${leopardFont} ${
                responseLookAndFeel.blockTextColor === 'light' ? 'white--text' : ''
              }`"
            >
              <span v-html="addAccessibilityPrefix(chunkText)"></span>
            </span>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <Card v-if="hasCard() && isLastItem" :item="item" :ripple="false" class="mb-2" />
    <CardCustomHtml v-if="hasCardCustomHtml()" :item="item" class="mb-2" />
    <!-- Show Inline Components -->
    <span v-for="(extension, index) in itemExtensions(item)" :key="index + 'inlines' + uuid">
      <v-row v-if="afterAnswerAlert(extension)" no-gutters class="pt-2">
        <v-col cols="12">
          <Alert :config="afterAnswerAlert(extension)"></Alert>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'youTube')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <YouTube :video-id="youTubeVideoId(extension)" class="mt-2"></YouTube>
        </v-col>
      </v-row>
      <v-row
        v-if="hasInlineType(extension, 'audio') && audioInfo(extension).audioUrl"
        no-gutters
        class="px-3 pt-2"
      >
        <v-col cols="12">
          <Audio :url="audioInfo(extension).audioUrl" class="mt-2"></Audio>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'vimeo')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <Vimeo :video-id="vimeoId(extension)" class="mt-2"></Vimeo>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'video')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <Video
            :url="videoInfo(extension).videoUrl"
            :type="videoInfo(extension).videoType"
            class="mt-2"
          ></Video>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'map')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <Map :address="mapInfo(extension).address" class="mt-2"></Map>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'image')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <ImageAnimation :url="imageUrl(extension)" class="mt-2"></ImageAnimation>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'carousel')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <Carousel :image-items="carouselImageArray(extension)" class="mt-2"></Carousel>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'table')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <SimpleTable :extension="extension"></SimpleTable>
        </v-col>
      </v-row>
      <v-row v-if="hasInlineType(extension, 'cardCustomHtml')" no-gutters class="px-3 pt-2">
        <v-col cols="12">
          <CardCustomHtml :item="item" class="mb-2" />
        </v-col>
      </v-row>
    </span>

    <DelayedResponse v-if="showDelayedResponse && isLastItem"></DelayedResponse>
    <!-- show any options in the response: for example Yes, No Maybe -->
    <v-col v-if="routerCheckList && isLastItem" cols="12" class="px-3">
      <v-card>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <h2 class="headline">{{ routerCheckList.title }}</h2>

            <v-row
              v-for="(routerItem, index) in routerCheckList.items"
              :key="index"
              align="center"
              justify="start"
              class="ml-1"
            >
              <v-col cols="2">
                <v-icon :color="routerItem.color">{{ routerItem.icon }}</v-icon>
              </v-col>
              <v-col cols="10">
                <p>{{ routerItem.label }}</p>
              </v-col>
            </v-row>
          </div>

          <v-avatar class="ma-3" size="100" tile>
            <v-img
              src="https://wi.presales.artificial-solutions.com/media/mytelco/router.png"
            ></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-col>

    <v-card
      v-if="hasCollection && getOptions && (isLastItem || hasPermanentOptions)"
      class="mb-1 mx-3 pt-0 px-1 pb-2 elevation-0 text-center transparent teneo-response-collection"
    >
      <!-- Button Options -->
      <v-card-text v-if="!hasLongOptions" class="teneo-button-options pt-2 pb-2">
        <h2 class="subtitle-1 font-weight-bold" v-text="getOptions.title"></h2>
        <div v-if="getOptions.html" class="elevation-2 mt-2" v-html="getOptions.items"></div>
        <span v-for="(option, optionIndex) in getOptions.items" v-else :key="optionIndex + uuid">
          <v-btn
            min-height="25"
            class="option-btn mr-2 mt-2"
            x-small
            :disabled="hasPermanentOptions && !isLastItem && shouldDisable ? true : false"
            :color="option.color || `success ${textColor('success')}`"
            :aria-label="option.aria ? option.aria : option.name"
            @click="optionClicked(option)"
          >
            <v-icon v-if="option.icon" left style="padding-top: 2px; opacity: 0.7 !important">{{
              `mdi-${option.icon}`
            }}</v-icon>
            {{ option.name }}
          </v-btn>
        </span>
      </v-card-text>
      <!-- Line based List Options -->

      <v-list v-else class="mt-2 elevation-2" :color="getListColor">
        <v-list-item-group>
          <template v-for="(option, altOptionIndex) in getOptions.items">
            <v-list-item
              :key="altOptionIndex + 'tile' + uuid"
              tag="a"
              :aria-label="option.aria ? option.aria : option.name"
              class="text-left pl-2 pr-2"
              style="height: 40px"
              :color="option.color || ``"
              dense
              ripple
              :input-value="option.color ? true : false"
              @click="optionClicked(option)"
            >
              <v-list-item-icon v-if="!('showIcon' in option) || option.showIcon" class="mr-4">
                <v-icon>{{
                  option.icon ? `mdi-${option.icon}` : getLongListIcon(altOptionIndex)
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="text-left">
                <!-- <v-list-item-title v-html="option.name"></v-list-item-title> -->
                <v-list-item-subtitle
                  style="white-space: unset"
                  v-html="option.name"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- more info for modals & calendar picker button -->
    <v-row v-if="hasFeedbackForm(item) && isLastItem" no-gutters class="mr-3">
      <v-col cols="12" class="text-right mb-2">
        <v-btn
          :color="`success ${textColor('success')}`"
          aria-label="Leave Feedback"
          class="modal-btn mt-2"
          small
          @click="displayFeedbackForm"
        >
          <v-icon left class="teneo-icon" style="opacity: 0.7 !important"
            >mdi-thumbs-up-down</v-icon
          >
          {{ getFeedbackFormConfig.label ? getFeedbackFormConfig.label : "Leave Feedback" }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- Show button that minimizes chat on mobile when redirect url is present -->
    <v-row
      v-if="
        (isMobileDevice || isSimulatedMobileDevice) &&
        isLastItem &&
        hasOutputUrl() &&
        $vuetify.breakpoint.mdAndDown
      "
      no-gutters
      class="mr-3"
    >
      <v-col cols="12" class="text-right mb-2">
        <v-btn
          :color="`success ${textColor('success')}`"
          aria-label="Minimize Chat Window"
          class="modal-btn mt-2"
          small
          @click="minimizeChat()"
        >
          <v-icon left class="teneo-icon" style="opacity: 0.7 !important"
            >mdi-page-previous-outline</v-icon
          >
          Page
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!completedForm && hasForm()" no-gutters class="mr-4">
      <v-col cols="12" class="text-right mb-2">
        <Form
          v-if="mustShowForm()"
          :form-config="getFormConfig()"
          @show-form="showForm()"
          @hide-form="hideForm()"
          @completed="completed()"
          @handle-focus="handleFocus()"
        />

        <v-btn
          :color="`success ${textColor('success')}`"
          aria-label="Form needs filling opens in a new window"
          class="modal-btn mt-2"
          small
          @click="showForm()"
        >
          <v-icon left class="teneo-icon" style="opacity: 0.7 !important"
            >mdi-file-document-edit-outline</v-icon
          >
          {{ getFormConfig() && getFormButtonText() ? getFormButtonText() : "Form" }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-if="
        (item.hasExtraData && hasModal(item) && notLiveChatTranscript) || itemHasLongResponse(item)
      "
      no-gutters
      class="mt-0 mr-3"
    >
      <v-col cols="12" class="text-right mb-1">
        <v-btn
          :aria-label="modalButtonText.aria"
          :color="`success ${textColor('success')}`"
          class="modal-btn mt-2"
          small
          @click="showModal"
        >
          <v-icon left class="teneo-icon" style="opacity: 0.7 !important">{{
            modalButtonIcon
          }}</v-icon>
          {{ modalButtonText.text }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="mustShowDate && isLastItem" no-gutters class="mt-2 mr-3">
      <!-- Date Picker -->
      <v-col class="text-right" cols="12">
        <v-btn
          small
          aria-label="Open Date Picker"
          fab
          class="teneo-userinput-icon elevation-2 mb-2"
          :color="`success ${textColor('success')}`"
          @click="toggleDate()"
        >
          <v-icon class="teneo-icon" style="opacity: 0.7 !important">mdi-calendar-clock</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="mustShowTime && isLastItem" no-gutters class="mt-2 mr-3">
      <!-- Time Picker -->
      <v-col class="text-right" cols="12">
        <v-btn
          small
          fab
          aria-label="Open Time Picker"
          class="teneo-userinput-icon elevation-2 mb-2"
          :color="`success ${textColor('success')}`"
          @click="toggleTime()"
        >
          <v-icon large class="teneo-icon" style="opacity: 0.7 !important">mdi-clock</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-if="snackbar"
      v-model="snackbar"
      absolute
      color="primary"
      :timeout="snackBarTimeout"
      top
      >{{ snackBarText }}</v-snackbar
    >
    <AgentAssistCannedResponseForm
      v-if="agentAssist.cannedResponseForm"
      :text="agentAssist.cannedResponseText"
      @hide-dialog="agentAssist.cannedResponseForm = false"
      @saved="handleAgentAssistCannedResponseSave"
    />
  </div>
</template>

<script>
import LongPress from "vue-directive-long-press";
import { mapGetters } from "vuex";
import copy from "copy-to-clipboard";
const TIE = require("leopard-tie-client");

const logger = require("@/utils/logging").getLogger("ChatTeneoResponse.vue");
const isHtml = require("is-html");
const stripHtml = require("striptags");

export default {
  name: "ChatTeneoResponse",
  directives: {
    "long-press": LongPress
  },
  components: {
    AgentAssistCannedResponseForm: () => import("@/components/AgentAssistCannedResponseForm"),
    Alert: () => import("@/components/Alert"),
    Audio: () => import("@/components/Audio"),
    Card: () => import("@/components/Card"),
    CardCustomHtml: () => import("@/components/CardCustomHtml"),
    Carousel: () => import("@/components/Carousel"),
    DelayedResponse: () => import("@/components/DelayedResponse"),
    Form: () => import("@/components/Form"),
    ImageAnimation: () => import("@/components/ImageAnimation"),
    Map: () => import("@/components/Map"),
    SimpleTable: () => import("@/components/SimpleTable"),
    Video: () => import("@/components/Video"),
    Vimeo: () => import("@/components/Vimeo"),
    YouTube: () => import("@/components/YouTube")
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    itemIndexInDialog: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      snackbar: false,
      snackBarTimeout: 1500,
      snackBarText: "Success",
      agentAssist: {
        cannedResponseForm: false,
        cannedResponseText: "",
        menu: [
          {
            icon: "mdi-backburger",
            title: "Send to live chat",
            method: this.sendToLiveChatAgentInputBox
          },
          {
            icon: "mdi-clipboard-arrow-up-outline",
            title: "Copy to clipboard",
            method: this.copyToClipboard
          },
          {
            icon: "mdi-pound-box-outline",
            title: "Add as canned response",
            method: this.showLiveAgentCannedResponseForm
          },
          {
            icon: "mdi-refresh",
            title: "Reset bot session",
            method: this.resetBotSession
          },
          {
            icon: "mdi-link-box-variant-outline",
            title: "Send URL to customer",
            condition: this.hasLink,
            method: this.sendLinkToLiveAgent
          },
          {
            icon: "mdi-tooltip-image-outline",
            title: "Get media data",
            condition: this.hasMedia,
            method: this.sendResponseMediaToLiveAgent
          },
          {
            icon: "mdi-arrow-expand-up",
            title: "Create moment",
            condition: false,
            method: this.createLiveChatMoment
          }
        ]
      },
      displayForm: false,
      hasFormAutomaticallyDisplayed: false,
      completedForm: false
    };
  },
  computed: {
    ...mapGetters([
      "leopardFont",
      "responseLookAndFeel",
      "isLiveAgentAssist",
      "dark",
      "textColor",
      "itemAnswerTextCropped",
      "showChatIcons",
      "itemExtensions",
      "getNamedExtension",
      "getFeedbackFormConfig",
      "imageUrl",
      "isMobileDevice",
      "isSimulatedMobileDevice",
      "carouselImageArray",
      "responseIcon",
      "uuid",
      "hasInline",
      "hasMediaExtensions",
      "hasInlineType",
      "showFeedbackForm",
      "dialogs",
      "getLatestDialogHistory",
      "hasModal",
      "hasFeedbackForm",
      "lastItemHasLongResponse",
      "itemHasLongResponse",
      "showDelayedResponse",
      "vimeoId",
      "audioInfo",
      "videoInfo",
      "mapInfo",
      "youTubeVideoId"
    ]),
    isLastItem() {
      return this.itemIndexInDialog === this.dialog.length - 1;
    },
    routerCheckList() {
      const extensions = this.itemExtensions(this.item);
      let routerCheckList = null;

      extensions.forEach(extension => {
        if (String(extension.name).startsWith("displayRouterCheckList")) {
          routerCheckList = extension.parameters;
        }
      });

      return routerCheckList;
    },
    getResponseIconColor() {
      let iconColor = this.responseLookAndFeel.iconColor;
      if ("teneoResponse" in this.item) {
        const tResp = TIE.wrap(this.item.teneoResponse);
        if (tResp.hasParameter("iconColor")) {
          iconColor = tResp.getParameter("iconColor");
          logger.info("Custom Icon Color:" + iconColor);
        }
      }

      return iconColor;
    },
    getResponseIcon() {
      let icon = this.responseIcon;

      if ("teneoResponse" in this.item) {
        const tResp = TIE.wrap(this.item.teneoResponse);
        if (tResp.hasEmotion() && tResp.getEmotion().indexOf("|") !== -1) {
          const rawEmotion = decodeURIComponent(tResp.getEmotion());
          icon = `mdi-${rawEmotion.split("|")[1].trim()}`;
        } else if (tResp.hasParameter("icon")) {
          icon = `mdi-${tResp.getParameter("icon")}`;
        }
      }
      return icon;
    },
    dynamicAgentAssistMenu() {
      const filtered = this.agentAssist.menu.filter(menuItem => {
        if ("condition" in menuItem) {
          if (typeof menuItem.condition === "boolean") {
            return menuItem.condition;
          }
          if (typeof menuItem.condition === "function") {
            return menuItem.condition();
          }
          return false;
        }
        return true;
      });

      return filtered;
    },
    modalButtonText() {
      const tResp = TIE.wrap(this.item.teneoResponse);

      const response = {
        text: this.$t("button.more"),
        aria: this.$t("button.more")
      };

      if (this.itemHasLongResponse(this.item)) {
        response.aria = "Read full response will open in a new window.";
        return response;
      }
      const extensions = this.itemExtensions(this.item);
      let countOfNonInlines = 0;
      let buttonLabel = this.$t("button.more");
      let aria = this.$t("button.more");

      if (tResp.hasLink()) {
        aria = `Website ${aria}`;
        buttonLabel = this.$t("button.page");
      }

      const externalExtensions = extensions.filter(
        extension =>
          !tResp.hasLink() &&
          (!String(extension.name).startsWith("displayCollection") ||
            ("inline" in extension && !extension.inline))
      );

      externalExtensions.forEach(extension => {
        const ariaButtonLabel = extension.title
          ? extension.title
          : extension.aria
          ? extension.aria
          : "";
        aria = ariaButtonLabel
          ? `about "${ariaButtonLabel}" will open in a new window`
          : `available will open in a new window`;

        countOfNonInlines += 1;
        if (String(extension.name).startsWith("displayVideo")) {
          buttonLabel = this.$t("button.video");
          aria = `Video ${aria}`;
        } else if (String(extension.name).startsWith("displayPanel")) {
          buttonLabel = this.$t("button.more");
          aria = `More information ${aria}`;
        } else if (String(extension.name).startsWith("displayImageCarousel")) {
          buttonLabel = this.$t("button.image");
          aria = `Image carousel ${aria}`;
        } else if (String(extension.name).startsWith("displayImage")) {
          buttonLabel = this.$t("button.image");
          aria = `Image ${aria}`;
        } else if (String(extension.name).startsWith("displayModal")) {
          buttonLabel = this.$t("button.more");
          aria = `More information ${aria}`;
        } else if (String(extension.name).startsWith("displayMap")) {
          buttonLabel = this.$t("button.map");
          aria = `Map ${aria}`;
        } else if (
          String(extension.name).startsWith("displayTable") ||
          String(extension.name).startsWith("displayTransactionsTable")
        ) {
          aria = `Table ${aria}`;
          buttonLabel = this.$t("button.table");
        }
      });
      if (countOfNonInlines > 1) {
        aria = "More information will open in a new window";
        buttonLabel = this.$t("button.more"); // fallback to "more" when there could be multiple
      }
      response.aria = !String(aria).startsWith("available")
        ? aria
        : "More information will open in a new window";
      response.text = buttonLabel || this.$t("button.more");
      return response;
    },
    modalButtonIcon() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      const extensions = this.itemExtensions(this.item);
      let countOfNonInlines = 0;
      let iconName = "mdi-arrow-top-left-thick";
      extensions.forEach(extension => {
        if (!extension.inline || tResp.hasLink()) {
          countOfNonInlines += 1;
        }

        if (String(extension.name).startsWith("displayVideo")) {
          iconName = "mdi-youtube";
        } else if (String(extension.name).startsWith("displayImageCarousel")) {
          iconName = "mdi-view-carousel";
        } else if (String(extension.name).startsWith("displayImage")) {
          iconName = "mdi-file-image";
        } else if (
          String(extension.name).startsWith("displayTable") ||
          String(extension.name).startsWith("displayTransactionsTable")
        ) {
          iconName = "mdi-table-large";
        } else if (String(extension.name).startsWith("displayMap")) {
          iconName = "mdi-google-maps";
        } else if (String(extension.name).startsWith("displayAudio")) {
          iconName = "mdi-music-box";
        }

        if (tResp.hasLink()) {
          iconName = "mdi-link-variant";
        }
      });

      if (countOfNonInlines > 1) {
        return "mdi-arrow-top-left-thick";
      }

      return iconName;
    },
    itemText() {
      let itemText = this.item.text;
      if (itemText.includes("||")) {
        const firstAnswer = itemText.split("||")[0].trim();
        itemText = firstAnswer;
      } else {
        itemText = this.itemAnswerTextCropped(this.item);
      }
      return itemText;
    },
    hasCollection() {
      const extensions = this.itemExtensions(this.item);
      let hasOptions = false;

      extensions.forEach(extension => {
        if (String(extension.name).startsWith("displayCollection")) {
          hasOptions = true;
        }
      });

      return hasOptions;
    },
    responseHasChunks() {
      return this.item.type === "reply" && this.item.text.includes("||");
    },
    getChunks() {
      const chunks = this.item.text.split("||");
      chunks.shift(); // get everything but the first one
      return chunks;
    },
    dialog() {
      if (this.$route.name === "chat") {
        return this.dialogs ? this.dialogs : [];
      }
      // history in session storage
      return this.getLatestDialogHistory ? this.getLatestDialogHistory : [];
    },
    shouldDisable() {
      const extensions = this.itemExtensions(this.item);
      let shouldDisable = false;
      extensions.forEach(extension => {
        if (String(extension.name).startsWith("displayCollection")) {
          logger.info(`Buttons are going to be disabled when not last`, extension);
          if (extension.disabled !== "undefined") {
            shouldDisable = extension.disabled;
          }
        }
      });
      return shouldDisable;
    },
    hasPermanentOptions() {
      const extensions = this.itemExtensions(this.item);
      let hasPermanentOptions = false;
      extensions.forEach(extension => {
        if (String(extension.name).startsWith("displayCollection")) {
          if (extension.permanent !== "undefined") {
            hasPermanentOptions = extension.permanent;
          }
        }
      });
      return hasPermanentOptions;
    },
    hasLongOptions() {
      const extensions = this.itemExtensions(this.item);
      let hasLongOptions = false;
      extensions.forEach(extension => {
        if (String(extension.name).startsWith("displayCollection")) {
          if (extension.hasLongOptions !== "undefined") {
            hasLongOptions = extension.hasLongOptions;
          }
        }
      });
      return hasLongOptions;
    },
    getListColor() {
      const extensions = this.itemExtensions(this.item);
      // only get the first set of options.
      let listColor = ``;
      extensions.forEach(extension => {
        if (extension.name === "displayCollection") {
          listColor = extension.parameters.content.color || ``;
        }
      });
      return listColor;
    },
    getOptions() {
      const extensions = this.itemExtensions(this.item);
      // only get the first set of options.
      let options = {};
      extensions.forEach(extension => {
        if (extension.name === "displayCollection") {
          options = extension.parameters.content;
        }
      });
      return options;
    },
    mustShowDate() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      if (tResp.hasParameter("datePicker")) {
        return true;
      }
      return false;
    },
    notLiveChatTranscript() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      return !tResp.hasParameter("liveChat");
    },
    mustShowTime() {
      const tResp = TIE.wrap(this.item.teneoResponse);

      if (tResp.hasParameter("timePicker")) {
        return true;
      }
      return false;
    }
  },
  methods: {
    minimizeChat() {
      logger.info("Minimizing chat because output URL is present and button clicked");
      this.$store.commit("MINIMIZE_NOW");
    },
    hasOutputUrl() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      logger.info(`Boom:: `, tResp.hasLink());
      return tResp.hasLink();
    },
    beforeAnswerAlert(extension) {
      // const extensions = this.itemExtensions(this.item);
      let alertConfig = null;

      // extensions.forEach(extension => {
      //   if (String(extension.name).startsWith("displayAlert") && extension.beforeAnswer === true) {
      //     alertConfig = extension;
      //   }
      // });

      if (String(extension.name).startsWith("displayAlert") && extension.beforeAnswer === true) {
        alertConfig = extension;
      }

      return alertConfig;
    },
    afterAnswerAlert(extension) {
      // const extensions = this.itemExtensions(this.item);
      let alertConfig = null;

      // extensions.forEach(extension => {
      //   if (String(extension.name).startsWith("displayAlert") && extension.beforeAnswer === false) {
      //     alertConfig = extension;
      //   }
      // });

      if (String(extension.name).startsWith("displayAlert") && extension.beforeAnswer === false) {
        alertConfig = extension;
      }

      return alertConfig;
    },
    responseChunkStyles(index = 0) {
      let classes = !this.showChatIcons || this.$vuetify.breakpoint.smAndDown ? "ml-2" : "";
      classes += this.hasBorder(index) ? " leopard-response-border" : "";
      return classes;
    },
    hasBorder(index = 0) {
      let borderExists = false;
      if ("teneoResponse" in this.item) {
        const tResp = TIE.wrap(this.item.teneoResponse);
        if (tResp.hasParameter("border")) {
          borderExists = true;
        }
        if (tResp.hasParameter("borders")) {
          let borders = tResp.getParameter("borders");
          if (index < borders.length && borders[index]) {
            borderExists = true;
          } else {
            borderExists = false;
          }
        }
      }
      return borderExists;
    },
    getBorderColor(index = 0) {
      let borderColor = "";
      if (this.hasBorder(index)) {
        let tResp = TIE.wrap(this.item.teneoResponse);
        if (tResp.hasParameter("border")) {
          borderColor = tResp.getParameter("border");
        }
        if (tResp.hasParameter("borders")) {
          let borders = tResp.getParameter("borders");
          if (index < borders.length && borders[index]) {
            borderColor = borders[index];
          } else {
            borderColor = "";
          }
        }
      }
      return borderColor;
    },
    addAccessibilityPrefix(text) {
      const prefix508 = `<span class="sr-only">Chat bot said.</span>`;
      if (!isHtml(text)) {
        text = `<p>${prefix508}${text}</p>`;
      } else if (String(text).startsWith("<p>")) {
        text = `<p>${prefix508}${text.substring(3)}`;
      } else {
        text = `<p>${prefix508}${text}</p>`; // TODO: Don't like this as we could have nested paragraphs
      }
      return text;
    },
    hasMedia() {
      return this.hasMediaExtensions(this.item);
    },
    sendResponseMediaToLiveAgent() {
      logger.debug(`Sending media to Agent`);
      let finalMessageToAgent = "";
      const extensions = this.itemExtensions(this.item);
      extensions.forEach(extension => {
        if (this.hasInlineType(extension, "youTube")) {
          finalMessageToAgent += `\nYouTube: https://www.youtube.com/watch?v=${this.youTubeVideoId(
            extension
          )}`;
        } else if (this.hasInlineType(extension, "vimeo")) {
          finalMessageToAgent += `\nVimeoId: ${this.vimeoId(extension)}`;
        } else if (this.hasInlineType(extension, "video")) {
          finalMessageToAgent += `\nVideo: ${this.videoInfo(extension).videoUrl}`;
        } else if (this.hasInlineType(extension, "map")) {
          finalMessageToAgent += `\nAddress: ${this.mapInfo(extension).address}`;
        } else if (this.hasInlineType(extension, "image")) {
          logger.debug(this.imageUrl(extension));
          finalMessageToAgent += `\nImage: ${this.imageUrl(extension)}`;
        } else if (this.hasInlineType(extension, "carousel")) {
          finalMessageToAgent += `\nImages: ${this.carouselImageArray(extension)}`;
        }
      });
      if (finalMessageToAgent) {
        this.$store.dispatch("putLiveChatAgentMessage", decodeURIComponent(finalMessageToAgent));
      }
    },
    createLiveChatMoment() {
      logger.debug(`Create Moment`);
    },
    handleAgentAssistCannedResponseSave() {
      this.agentAssist.cannedResponseForm = false;
      this.snackBarText = "#️⃣ New canned response added";
      this.snackbar = true;
    },
    showLiveAgentCannedResponseForm() {
      this.agentAssist.cannedResponseText = stripHtml(this.itemText);
      this.agentAssist.cannedResponseForm = true;
    },
    hasLink() {
      return TIE.wrap(this.item.teneoResponse).hasLink();
    },
    sendLinkToLiveAgent() {
      this.$store.dispatch(
        "putLiveChatAgentMessage",
        decodeURIComponent(TIE.wrap(this.item.teneoResponse).getLink())
      );
    },
    resetBotSession() {
      this.$store.dispatch("endTeneoSessionLite").then(() => {
        this.snackBarText = "♻ Bot session reset";
        this.snackbar = true;
      });
    },
    copyToClipboard() {
      copy(stripHtml(this.itemText));
      this.snackBarText = "📋 Copied to your clipboard";
      this.snackbar = true;
    },
    sendToLiveChatAgentInputBox() {
      this.$store.dispatch("putLiveChatAgentMessage", this.itemText);
    },
    isLastInDialog() {
      return this.itemIndexInDialog === this.dialog.length - 1;
    },
    handleFocus() {
      this.$emit("handle-focus");
    },
    mustShowForm() {
      if (this.displayForm) {
        return true;
      }
      const formConfig = this.getFormConfig();

      if (
        this.isLastInDialog() &&
        !this.hasFormAutomaticallyDisplayed &&
        formConfig &&
        formConfig.openAutomatically
      ) {
        this.hasFormAutomaticallyDisplayed = true;
        this.displayForm = true;
        return true;
      }

      return false;
    },
    completed() {
      this.hideForm();
      this.completedForm = true;
      this.$store.commit("REMOVE_FORM_CONFIG", this.item.id);
    },
    showForm() {
      this.displayForm = true;
    },
    hideForm() {
      this.displayForm = false;
    },
    hasForm() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      if (tResp.hasParameter("formConfig")) {
        return true;
      }
      return false;
    },
    getFormConfig() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      if (tResp.hasParameter("formConfig")) {
        return tResp.getParameter("formConfig");
      }
      return null;
    },
    getFormButtonText() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      if (tResp.hasParameter("formConfig")) {
        return tResp.getParameter("formConfig").openFormButtonText;
      }
      return null;
    },
    hasCard() {
      const tResp = TIE.wrap(this.item.teneoResponse);
      if (tResp.hasParameter("displayCard")) {
        logger.info("Yes there is a card");
        return true;
      }
      return false;
    },
    hasCardCustomHtml() {
      const cardCustomHtml = this.getNamedExtension(this.item, "displayCardCustomHtml");
      logger.info("...Yes there is a custom html card", cardCustomHtml, this.item);
      if (cardCustomHtml) {
        logger.info("Yes there is a custom html card");
        return true;
      } else {
        return false;
      }
    },
    getLongListIcon(altOptionIndex) {
      let iconName = "mdi-numeric-9-plus-box-outline";
      if (altOptionIndex + 1 <= 9) {
        iconName = `mdi-numeric-${altOptionIndex + 1}-box-outline`;
      }
      return iconName;
    },
    showModal() {
      this.$store.commit("HIDE_CHAT_MODAL"); // hide all modals first
      this.$store.commit("HIDE_508_CONTENT");
      this.$store.commit("SHOW_CHAT_MODAL", this.item);
    },
    displayFeedbackForm() {
      this.$emit("show-feedback");
    },
    toggleDate() {
      this.$emit("toggle-date");
    },
    toggleTime() {
      this.$emit("toggle-time");
    },
    swapInputButton() {
      this.$emit("swap-input-button");
    },
    optionClicked(option) {
      this.$store.commit("SHOW_PROGRESS_BAR");
      this.$store.commit("SET_USER_INPUT", option.text ? option.text : option.name);
      const optionClickParam = "&isClick=true";
      this.$store
        .dispatch(
          "sendUserInput",
          option.params ? `&${option.params}${optionClickParam}` : optionClickParam
        )
        .then(() => {
          this.$emit("handle-focus");
        });
    }
  }
};
</script>

<style scoped>
.leopard-response-border {
  padding-left: 20px !important;
}

.teneo-button-options {
  padding: 0;
}

.option-btn {
  font-size: 13px;
  white-space: normal;
  text-transform: unset;
  height: unset !important;
  display: unset;
  min-height: 25px;
}

.modal-btn {
  font-size: 13px;
  white-space: normal;
}

.options-list {
  height: 50px !important;
}

.options-list-subtile {
  color: unset !important;
}
</style>
