from app import generate_daily_plan


def test_generate_daily_plan_returns_four_sections():
    plan = generate_daily_plan("low", "tired", "rest")

    assert set(plan.keys()) == {"must_do", "easy", "self_care", "fun"}
    assert len(plan["must_do"]) >= 1
    assert len(plan["easy"]) >= 1
    assert len(plan["self_care"]) >= 1
    assert len(plan["fun"]) >= 1


def test_generate_daily_plan_uses_energy_specific_tasks():
    low_energy_plan = generate_daily_plan("low", "tired", "rest")
    high_energy_plan = generate_daily_plan("high", "motivated", "focus")

    assert any("stretch" in task.lower() for task in low_energy_plan["easy"])
    assert any("walk" in task.lower() for task in high_energy_plan["easy"])
