const AnimatedPlaceholder =(() => {
    const DEFAULT_OPTIONS = {
        // Minimum time between characters
        minTimeout: 80,
        // Maximum time between characters
        maxTimeout: 150,
        // Delay between phrases
        wait: 2000,
        // Show backspace animation
        backspace: true,
        // How long to wait between backspace animations
        backspaceInterval: 60,
        // Cursor character
        cursor: '|',
        // Timeout for character blink
        cursorTimeout: 500,
        // Prefix to display between 
        prefix: '',
        // Placeholders to display
        placeholders : ['Example 1', 'Example 2']
    }

    class AnimatedPlaceholder {
        constructor(selector, options = {}) {
            this.selector = selector;

            if( 'undefined' === typeof this.selector ) {
                throw new Error('No selector specified for animated placeholder');
            }

            this.elements = document.querySelectorAll(this.selector);

            this.options = Object.assign({}, DEFAULT_OPTIONS, options);

            this.placeholderIndex = 0;

            this.showCursor = true;

            this.currentText = [];
            this.remainingText = this.options.placeholders[this.placeholderIndex].split('');

            this.textTimeoutId = 0;
            this.cursorTimeoutId = 0;

            window.addEventListener('load', () => {
                this.textTimeoutId = setTimeout(() => {
                    this._animate();
                    if(this.options.cursor) {
                        this._animateCursor();
                    }
                }, this.options.wait);
                
            });

            this.elements.forEach((el) => {
                el.addEventListener('focus', () => {
                    clearTimeout(this.textTimeoutId);
                    clearInterval(this.cursorIntervalId);
                    this._reset();
                    this.elements.forEach((el) => {      
                        el.setAttribute('placeholder', '');
                    })
                })

                el.addEventListener('blur', () => {
                    this._animate()
                    if(this.options.cursor) {
                        this._animateCursor();
                    }
                })
            });
        }

        

        _reset() {
            this.currentText = [];
            this.remainingText = this.options.placeholders[this.placeholderIndex].split('');
        }
    

        _getTimeout() {
            const timeout = Math.floor(Math.random() * (this.options.maxTimeout - this.options.minTimeout + 1) + this.options.minTimeout);
            return timeout;
        }

        _setPlaceholder() {
            this.elements.forEach((el) => {
                let text = this.options.prefix + this.currentText.join('');

                if(this.showCursor) {
                    text += this.options.cursor;
                }

                el.setAttribute('placeholder', text);
            })
        }

        _animate() {
            if(!this.remainingText.length) {
                this.placeholderIndex++;

                if(this.placeholderIndex >= this.options.placeholders.length) {
                    this.placeholderIndex = 0;
                }

                if(this.options.backspace) {
                    this.textTimeoutId = setTimeout(() => {
                        this._setPlaceholder();
                        this._animateBackspace()
                    }, this.options.wait);
                } else {
                    this._reset();
                    this.textTimeoutId = setTimeout(() => {
                        this._setPlaceholder();
                        this._animate()
                    }, this.options.wait);
                }
            } else {

                this.currentText.push(this.remainingText.shift())

                this.textTimeoutId = setTimeout(() => {
                    this._setPlaceholder();
                    this._animate()
                }, this._getTimeout());
            }
        }

        _animateBackspace() {
            if(this.currentText.length) {
                this.currentText.pop();

                this.textTimeoutId = setTimeout(() => {
                    this._setPlaceholder();
                    this._animateBackspace();
                }, this.options.backspaceInterval);
            } else {
                this._reset();

                this.textTimeoutId = setTimeout(() => {
                    this._setPlaceholder();
                    this._animate();
                }, this._getTimeout());
            }
        }

        _animateCursor() {
            this.cursorIntervalId = setInterval(() => {
                this.showCursor = !this.showCursor;
                this._setPlaceholder();
            }, this.options.cursorTimeout)
        }
        
    }

    return AnimatedPlaceholder;
})();

export default AnimatedPlaceholder;

// Global
window.AnimatedPlaceholder = AnimatedPlaceholder;