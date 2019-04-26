<template>
  <div>
    <div class="base-html-editor">
      <editor class="editor"
        v-model="internalValue"
        :init="{
          branding: false,
          menubar: false,
          plugins: 'link',  
          width: width,
          height: height, 
          inline: true,   
          toolbar: toolbar
        }"
      >
      </editor>
    </div>
    <div class="v-messages theme--light">
      Sätt markören i fältet ovan för att ange HTML-formatterad text.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Helper } from '@/utils/helper';
import tinymce from 'tinymce/tinymce'; // Import tinymce, required to use tinymce without cloud
import 'tinymce/themes/modern/theme'; // Import tinymce theme, required to use tinymce without cloud
import Editor from '@tinymce/tinymce-vue'; // Import tinymce-vue plugin
import 'tinymce/skins/lightgray/skin.min.css'; // Import of tinymce skin, required to use tinymce without cloud
import 'tinymce/plugins/link'; // Import plugin link for the toolbar

// Init TinyMce
tinymce.init({});

/**
 * Base component for an html editor. Using TinyMce as editor.
 * @prop {string} 'v-model' - Text for html editor
 * @prop {string} width - Width of html editor, ex. '500'. Default is 100% to make it responsive
 * @prop {string} height - Height of html editor, ex. '500'. Default is undefined.
 * @prop {string} toolbar - Toolbar to use in editor. Available options: 'bold', 'italic', '|', 'link'
 */

@Component({
  components: {
    Editor
  }
})
export default class BaseHtmlEditor extends Vue {
  @Prop() public value!: string;
  @Prop( { default: '100%' } ) public width!: string;
  @Prop() public height!: string;
  @Prop({ default: 'bold, italic, | link' }) public toolbar!: string;

  public beforeDestroy() {
    const tinyMCE = (window as any).tinyMCE;
    tinyMCE.EditorManager.execCommand('mceRemoveEditor', false, tinyMCE.editors[0].id);
  }

  /**  Localcopy of text */
  get internalValue(): string {
    return this.value ? Helper.deepCopy<string>(this.value) : '';
  }

  /** Emit updated text */
  set internalValue(tinymceValue: string) {
    this.$emit('input', tinymceValue);
  }
}
</script>

<style lang="scss">
  .base-html-editor {
    background: #F2F2F2;
    .mce-content-body {
      padding:10px;
      
      p:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }
  }
</style>
