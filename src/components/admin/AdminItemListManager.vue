<template>
<div>
  <v-btn flat color="primary" @click="addItem()">
    <v-icon left>add</v-icon>
    {{ $t('component.adminItemListManager.addItem') }}
  </v-btn>
  <v-list two-line>
    <v-list-tile v-for="item in itemsCopy" :key="item.id">
      <v-list-tile-content>
        <!-- Title -->
        <v-text-field :label="$t('component.adminItemListManager.title')" :value="item.title" @input="updateTitle(item, $event)" style="width:98%"></v-text-field>
      </v-list-tile-content>
      <v-list-tile-action>
        <!-- Checkbox -->
        <v-checkbox ml-2
          v-model="item.isChecked"
          :value="item.isChecked"       
          :label="$t('component.adminItemListManager.checked')"
          :key="item.id"           
          type="checkbox" 
          color="primary"
          hide-details
          persistent-hint
          @change="onItemChangeCheck(item, $event)"
          ></v-checkbox>
      </v-list-tile-action>
      <!-- Delete -->
      <v-list-tile-action>
        <v-btn flat icon @click="removeItem(item)">
          <v-icon>delete_outline</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IItem } from '@/models/IForm';
import { Helper } from '@/utils/helper';

/**
 * Component that gives the user the possibillity to add, edit and remove
 * items from a list of objects implementing IItem
 */
@Component
export default class AdminItemListManager extends Vue {

  /** Whether or not user should be able to mark several items as "checked" */
  @Prop({ default: false }) public allowMultipleChecked!: boolean;

  /** Data model holding the items */
  @Prop() public items!: IItem[];

  /** Field-id */
  @Prop() public fieldId!: string;

  /**
   * Get items from state
   * @return {IItem[]} A list with items
   */
  get itemsCopy(): IItem[] {
    if (this.items) {
      return Helper.deepCopy(this.items) as IItem[];
    } else {
      return [] as IItem[];
    }
  }
  /**
   * Emit items changed
   * @param {IItem} items - Items to set
   */
  set itemsCopy(items: IItem[]) {
    this.$emit('update:items', items);
  }

  /**
   * Add new item to list
   */
  public addItem() {
    const newItemList = Helper.deepCopy<IItem[]>(this.itemsCopy);
    const newItem = {
      title: '',
      isChecked: false,
      id: Helper.generateUuid(),
    } as IItem | any;
    newItemList.push(newItem);
    this.$emit('update:items', newItemList);
  }

  /**
   * Update item in list
   */
  public updateTitle(item: IItem, newTitle: string) {
    const updateItem = this.itemsCopy.find(d => d.id === item.id) as IItem;

    // Should not happen..
    if (!updateItem) {
      console.error('Could not find item to update title for!');
    }
    // Update reference in itemsCopy
    updateItem.title = newTitle;

    this.$emit('update:items', this.itemsCopy);
  }

  /**
   * Remove item from list
   */
  private removeItem(itemToRemove: IItem) {
    const newItemList = this.itemsCopy.filter(item => item.id !== itemToRemove.id);
    this.$emit('update:items', newItemList);
  }

  /**
   * Check/uncheck item in list
   */
  private onItemChangeCheck(checkedItem: IItem, event) {
    // Check if more than one item can be changed
    if (!this.allowMultipleChecked) {
      this.itemsCopy.forEach(item => item.isChecked = false);
    }
    // Set checked item
    this.itemsCopy.forEach(item => {
      if (item.id === checkedItem.id) {
        // huh.. sometimes boolean sometimes event with target
        if (typeof(event) === 'boolean') {
          item.isChecked = event;
        } else if (event === null) {
          item.isChecked = false;
        } else {
          item.isChecked = event.target.checked;
        }
      }
    });

    this.$emit('update:items', this.itemsCopy);
  }
}
</script>