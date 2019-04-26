import { Component, Vue } from 'vue-property-decorator';

export const KeyCommands = {
  CTRL_S: 'KeyBoardEvent:ctrl+s',
  ALT_S: 'KeyBoardEvent:alt+s'
};

@Component
export class KeyBoardCommandMixin extends Vue {

  public beforeMount() {
    window.addEventListener('keydown', this.onKeyUp);
  }

  public beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyUp);
  }

  private onKeyUp(evt: KeyboardEvent) {
    if (evt.ctrlKey || evt.metaKey) {
      if (evt.keyCode === 83) { // ctrl + s
        evt.preventDefault();
        this.$emit(KeyCommands.CTRL_S, evt);
        return false;
      }
    }
    if (evt.altKey) {
      if (evt.keyCode === 83) { // alt + s
        evt.preventDefault();
        this.$emit(KeyCommands.ALT_S, evt);
        return false;
      }
    }
  }
}
