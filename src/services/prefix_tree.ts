class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isEnd = false;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let currNode = this.root;
    for (const char of word) {
      if (!currNode.children.has(char)) {
        currNode.children.set(char, new TrieNode());
      }
      currNode = currNode.children.get(char);
    }
    currNode.isEnd = true;
  }

  inverseStartsWIth(prefix: string): boolean {
    let currNode = this.root;

    for (const char of prefix) {
      if (currNode.isEnd) return true;
      if (!currNode.children.has(char)) return false;
      currNode = currNode.children.get(char);
    }

    return currNode.isEnd;
  }
}
