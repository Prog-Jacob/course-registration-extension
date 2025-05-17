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
  miss: number;
  hit: number;

  constructor() {
    this.root = new TrieNode();
    this.miss = 0;
    this.hit = 0;
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
    const isHit = this._inverseStartsWIth(prefix);
    isHit ? this.hit++ : this.miss++;
    return isHit;
  }

  private _inverseStartsWIth(prefix: string): boolean {
    let currNode = this.root;

    for (const char of prefix) {
      if (currNode.isEnd) return true;
      if (!currNode.children.has(char)) return false;
      currNode = currNode.children.get(char);
    }

    return currNode.isEnd;
  }

  log() {
    console.log('Number of cache hits:', this.hit, 'out of', this.hit + this.miss);
    console.log(`Hit ratio: ${((this.hit / (this.hit + this.miss)) * 100).toFixed(2)}%`);
  }
}
