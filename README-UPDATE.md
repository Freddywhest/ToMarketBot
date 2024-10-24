## README: Explanation and Usage of the new Configuration Parameters

### 1. `MAX_CONCURRENT_ACCOUNT`

- **Description**: Defines the maximum number of accounts that can run concurrently at a time.
- **Usage**: Limits the number of accounts or sessions that can be active at the same time.
- **Example**:

  ```text
  MAX_CONCURRENT_ACCOUNT=5
  ```

  This allows up to 5 accounts to run in parallel.

- **Note**: Setting to more than 10 will trigger warnings. I recommend setting it to 10 or less

### 2. `USE_NON_THREAD`

- **Description**: Enables or disables the use of non-threaded execution for tasks.
- **Usage**:
  - Set to `true` to disable threading and execute tasks sequentially.
  - Set to `false` to enable threaded execution for improved performance with concurrent tasks.
- **Example**:
  ```text
  USE_NON_THREAD=True
  ```
  This means that non-threading is enabled, and tasks can run in parallel.

### 3. `SLEEP_BETWEEN_NON_THREADS`

- **Description**: Defines the sleep time (in seconds) between executing non-threaded tasks.
- **Usage**: Determines how long to wait between each non-threaded task when threading is disabled.
- **Example**:
  ```text
  SLEEP_BETWEEN_NON_THREADS=[10, 20]
  ```
  This adds a random number between 10 and 20-second delay between non-threaded tasks when `USE_NON_THREAD=true`.

### 4. `DELAY_BETWEEN_GAME`

- **Description**: Defines the delay (in seconds) between completing one game and starting another.
- **Usage**: Useful for pacing the gameplay and preventing too many requests in a short period.
- **Example**:
  ```text
  DELAY_BETWEEN_GAME=[15, 30]
  ```
  This adds a random number between 15 and 30-second delay between each game session.

### 5. `DELAY_BETWEEN_SPIN`

- **Description**: Defines the delay (in seconds) between consecutive spins in a game.
- **Usage**: This controls the time interval between spins within a game to avoid overloading the system or being blocked.
- **Example**:
  ```text
  DELAY_BETWEEN_SPIN=[5, 10]
  ```
  This adds a random number between 5 and 10-second delay between spins during gameplay.

---

These parameters can be configured in your environment (`.env`) file. Adjusting these values allows you to control the performance and pacing of the system when dealing with accounts and game mechanics.
